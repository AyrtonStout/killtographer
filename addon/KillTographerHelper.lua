local _, module = ...

-- No need to store an assload of strings in the DB. Use IDs
local raceToId = {
    Human = 1,
    Orc = 2,
    Dwarf = 3,
    NightElf = 4,
    Scourge = 5,
    Tauren = 6,
    Gnome = 7,
    Troll = 8,
    Goblin = 9,
    BloodElf = 10,
    Draenei = 11,
    FelOrc = 12,
    Naga_ = 13,
    Broken = 14,
    Skeleton = 15,
    Vrykul = 16,
    Tuskarr = 17,
    ForestTroll = 18,
    Taunka = 19,
    NorthrendSkeleton = 20,
    IceTroll = 21,
    Worgen = 22,
    Pandaren = 24,
    Nightborne = 27,
    HighmountainTauren = 28,
    VoidElf = 29,
    LightforgedDraenei = 30,
    ZalandariTroll = 31,
    KulTiran = 32,
    ThinHuman = 33,
    DarkIronDwarf = 34,
    Vulpera = 35,
    MagharOrc = 36,
    Mechagnome = 37
}

local classToId = {
    WARRIOR = 1,
    PALADIN = 2,
    HUNTER = 3,
    ROGUE = 4,
    PRIEST = 5,
    DEATHKNIGHT = 6,
    SHAMAN = 7,
    MAGE = 8,
    WARLOCK = 9,
    MONK = 10,
    DRUID = 11,
    DEMONHUNTER = 12
}

local objectTypeToId = {
    Player = 1,
    Creature = 2,
    Pet = 3,
    GameObject = 4,
    Vehicle = 5,
    Vignette = 6,
    Environment = 42
}


function string.startsWith(haystack, needle)
    return string.sub(haystack, 1, string.len(needle)) == needle
end

function module:isPet(guid)
    return string.startsWith(guid, 'Pet')
end

function module:isPlayer(guid)
    return string.startsWith(guid, 'Player')
end

function module:isPlayerImportant(playerGUID, playerName)
    local selfGUID = UnitGUID("player")
    return (selfGUID == playerGUID or UnitPlayerOrPetInParty(playerName) or UnitPlayerOrPetInRaid(playerName))
end

function module:objectTypeFromGUID(guid)
    -- The environment has no GUID
    if (guid == nil or string.len(guid) == 0) then
        return nil
    end

    local guidTypeLength = string.find(guid, "-")
    local guidType = string.sub(guid, 1, guidTypeLength - 1)

    local objectId = objectTypeToId[guidType]
    if (objectId == nil) then
        print('KillTographer: Unknown object type ' .. guidType)
    end

    return objectId
end

local scanTool = CreateFrame( "GameTooltip", "ScanTooltip", nil, "GameTooltipTemplate" )
scanTool:SetOwner( WorldFrame, "ANCHOR_NONE" )
local ownerScanText = _G["ScanTooltipTextLeft2"] -- This is the line with <[Player]'s Pet>

function module:getPetOwner(petName)
    scanTool:ClearLines()
    scanTool:SetUnit(petName)
    local ownerText = ownerScanText:GetText()
    if not ownerText then return nil end
    local owner, _ = string.split("'",ownerText)

    return owner -- This is the pet's owner
end

function module:getPlayerData(playerGUID)
    if (playerGUID == nil) then
        return nil
    end

    local _, className, _, raceName, gender = GetPlayerInfoByGUID(playerGUID)

    return {
        class = classToId[className],
        race = raceToId[raceName],
        gender = gender
    }
end

-- Capital cities have their parents being the continent rather than their containing zone. Override those
local mapParentOverrides = {
    [1456] = 1412, -- TB to Mulgore
    [1454] = 1411, -- Org to Durotar
    [1458] = 1420, -- UC to Tirisfal
    [1453] = 1429, -- SW to Elwynn
    [1455] = 1426, -- IF to Dun Morogh
    [1457] = 1438, -- Darn to Teldrassil
}

local function getParentMap(mapId)
    local overrideId = mapParentOverrides[mapId]
    if (overrideId ~= nil) then
        return overrideId
    end

    local mapInfo = C_Map.GetMapInfo(mapId)
    return mapInfo['parentMapID']
end

-- Get the coordinates for the player in the current map, and in every parent map going up
-- If someone dies in TB, this will give us their coordinates in TB, Mulgore, Kalimdor, and finally Azeroth
function module:getSourceCoordinates(mapId)
    local coordinates = {}

    local currentMapId = mapId
    while (true) do
        local position = C_Map.GetPlayerMapPosition(currentMapId, "player")
        -- Though rare, I have seen this happen when I hearthed
        if (position == nil) then
            return false
        end

        local x, y = position:GetXY()
        local dataPoint = {
            mapId = currentMapId,
            x = x,
            y = y
        }
        table.insert(coordinates, dataPoint)

        local parentMapId = getParentMap(currentMapId)
        if (parentMapId == 0) then
            break
        else
            currentMapId = parentMapId
        end
    end

    return coordinates
end

local _, module = ...

local guidToLevel = {}

local function onTargetEvent(_, _, targetSelector)
    local guid = UnitGUID(targetSelector .. "target")
    if (guid == nil) then
        return
    end

    local level = UnitLevel(targetSelector .. "target")
    if (level == -1) then
        level = 0
    end

    guidToLevel[guid] = {
        level = level,
        time = math.floor(GetTime())
    }
end

local scanTool = CreateFrame( "GameTooltip", "ScanTooltip", nil, "GameTooltipTemplate" )
scanTool:SetOwner( WorldFrame, "ANCHOR_NONE" )

local function getPartyMemberLevel(guid, unitName)
    scanTool:ClearLines()
    scanTool:SetUnit(unitName)
    local text
    if (module:isPet(guid)) then
        text = _G["ScanTooltipTextLeft3"]:GetText()
    else
        text = _G["ScanTooltipTextLeft2"]:GetText()
    end

    -- String like 'Level 27 Orc Warlock'
    local iterator = string.gmatch(text, "%S+")
    iterator() -- 'Level'

    return iterator() -- actual level
end

function module:getLevel(guid, name)
    if (guidToLevel[guid] ~= nil) then
        return guidToLevel[guid]['level']
    end

    if (module:isPlayerImportant(guid, name)) then
        local partyLevel = getPartyMemberLevel(guid, name)
        if (partyLevel == nil) then
            --print('Failed to find level')
        else
            guidToLevel[guid] = {
                level = partyLevel,
                time = math.floor(GetTime())
            }
        end

        return partyLevel
    else
        --print('Level not found and player not important')
    end
    return nil
end

function module:cleanUpLevelData()
    local currentTime = math.floor(GetTime())

    for guid, data in pairs(guidToLevel) do
        if (currentTime - data['time'] > 300) then
            guidToLevel[guid] = nil
        end
    end
end

local f1 = CreateFrame("Frame")
f1:RegisterEvent("UNIT_TARGET")
f1:SetScript("OnEvent", onTargetEvent)



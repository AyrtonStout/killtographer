local _, module = ...

-- Maps a GUID to a damage event
local damageEvents = {}


local function onCombatLogEvent(_, _, ...)

    local timestamp, event, _, sourceGUID, sourceName, _, _, destGUID, destName, _, _, prefix1, prefix2 = CombatLogGetCurrentEventInfo()

    if (event == 'UNIT_DIED') then
        -- Wait a second before checking who did the killing blow. Could be race conditions on the kill event happening at the same time as this death event
        C_Timer.After(1, function() writeEvent(destGUID) end)
        return
    elseif (
            -- These are all the events we care about. Anything not one of these events can be ignored
            event ~= 'SWING_DAMAGE' and
                    event ~= 'SPELL_PERIODIC_DAMAGE' and
                    event ~= 'SPELL_DAMAGE' and
                    event ~= 'RANGE_DAMAGE' and
                    event ~= 'DAMAGE_SHIELD' and
                    event ~= 'ENVIRONMENTAL_DAMAGE' and
                    event ~= 'SPELL_INSTAKILL'
    ) then
        return
    end

    local damageSource
    local environmentEvent = false

    if (event == 'SWING_DAMAGE') then
        damageSource = "Melee"
    elseif (event == 'SPELL_PERIODIC_DAMAGE' or event == 'SPELL_DAMAGE' or event == 'RANGE_DAMAGE' or event == 'DAMAGE_SHIELD' or event == 'SPELL_INSTAKILL') then
        damageSource = prefix2
    elseif (event == 'ENVIRONMENTAL_DAMAGE') then
        sourceName = prefix1

        -- There is no source GUID for the environment
        sourceGUID = 'Environment-123'
        environmentEvent = true

        if (prefix1 == 'Drowning') then
            damageSource = 'Suffocation'
        elseif (prefix1 == 'Falling') then
            damageSource = 'Gravity'
        elseif (prefix1 == 'Fatigue') then
            damageSource = 'Exhaustion'
        elseif (prefix1 == 'Fire') then
            damageSource = 'Burning'
        elseif (prefix1 == 'Lava') then
            damageSource = 'Melting'
        elseif (prefix1 == 'Slime') then
            damageSource = 'Dissolve'
        else
            print('KillTographer: Unknown environmental damage source')
            return
        end
    else
        return
    end

    local killerPetOwner
    local victimPetOwner

    if (module:isPet(sourceGUID)) then
        killerPetOwner = module:getPetOwner(sourceName)
    end

    if (module:isPet(destGUID)) then
        victimPetOwner = module:getPetOwner(destName)
    end

    local epochSeconds = math.floor(timestamp)
    -- https://wow.gamepedia.com/UiMapID/Classic
    local mapId = C_Map.GetBestMapForUnit("player")
    local isInstance = mapId == nil

    if (isInstance) then
        local _, _, _, _, _, _, _, instanceId = GetInstanceInfo()
        mapId = instanceId
    end


    local killEntry = {
        timestamp = epochSeconds,
        killerName = sourceName,
        killerType = environmentEvent and 42 or module:objectTypeFromGUID(sourceGUID),
        killerId = sourceGUID,
        killerLevel = environmentEvent and 0 or module:getLevel(sourceGUID, sourceName),
        killerPetOwner = killerPetOwner,
        victimType = module:objectTypeFromGUID(destGUID),
        victimName = destName,
        victimId = destGUID,
        victimLevel = module:getLevel(destGUID, destName),
        victimPetOwner = victimPetOwner,
        killSource = damageSource,
        mapId = mapId,
        isInstance = isInstance,
        sourcePlayer = UnitName("player"),
        sourceLevel = UnitLevel("player"),
        realm = GetRealmName()
    }

    if (module:isPlayer(sourceGUID)) then
        killEntry['killerPlayerData'] = module:getPlayerData(sourceGUID)
    end

    if (module:isPlayer(destGUID)) then
        killEntry['victimPlayerData'] = module:getPlayerData(destGUID)
    end

    if (killerPetOwner ~= nil) then
        -- UnitGUID doesn't work on a name if they aren't in the party. So this will often return nil
        killEntry['killerPetOwnerPlayerData'] = module:getPlayerData(UnitGUID(killerPetOwner))
    end

    if (victimPetOwner ~= nil) then
        killEntry['victimPetOwnerPlayerData'] = module:getPlayerData(UnitGUID(victimPetOwner))
    end

    killEntry['sourcePlayerData'] = module:getPlayerData(UnitGUID("player"))

    if (not isInstance) then
        local coordinates = module:getSourceCoordinates(mapId)
        if (coordinates == false) then
            return
        end

        killEntry['coordinates'] = coordinates
    end

    -- Store this event for later. If / when the unit dies, we will grab the killing blow from this map
    damageEvents[destGUID] = {
        killEntry = killEntry,
        time = math.floor(GetTime())
    }
end

local function cleanupGarbageIfAble()
    local currentTime = math.floor(GetTime())

    for guid, data in pairs(damageEvents) do
        if (currentTime - data['time'] > 60) then
            damageEvents[guid] = nil
        end
    end

    module:cleanUpLevelData()
end

local f1 = CreateFrame("Frame")
f1:RegisterEvent("COMBAT_LOG_EVENT_UNFILTERED")
f1:SetScript("OnEvent", onCombatLogEvent)

local f2 = CreateFrame("Frame")
f2.elapsed = 60
f2:SetScript("OnUpdate", function(self, sinceLastUpdate)
    self.elapsed = self.elapsed - sinceLastUpdate
    if self.elapsed > 0 then
        return
    end

    self.elapsed = 60
    cleanupGarbageIfAble()
end);


function writeEvent(victimGUID)
    -- This is extremely rare. But did seem to happen if an enemy appeared right as it died
    local entry = damageEvents[victimGUID]

    if (entry == nil) then
        return
    end

    local killEntry = entry['killEntry']
    damageEvents[victimGUID] = nil -- Clean up memory since we know we don't need this anymore

    local victimName = killEntry['victimName']
    local victimId = killEntry['victimId']
    local victimLevel = killEntry['victimLevel']
    local killerName = killEntry['killerName']
    local killerId = killEntry['killerId']
    local killerLevel = killEntry['killerLevel']

    -- Check if the killer was someone that we care about (aka a party or raid member)
    if (not module:isPlayerImportant(killerId, killerName) and not module:isPlayerImportant(victimId, victimName)) then
        return
    end

    if (NewDataPoints3 == nil) then
        NewDataPoints3 = {}
    end

    if (killerLevel == nil) then
        killerLevel = '?'
    end

    -- print('Level ' .. victimLevel .. ' ' .. victimName ..' Killed by level ' .. killerLevel .. ' ' .. killerName .. ' using: ' .. killEntry['killSource'])

    table.insert(NewDataPoints3, killEntry)
end

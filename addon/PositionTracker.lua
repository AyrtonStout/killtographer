local _, module = ...

local function getMovementType()
    if (UnitOnTaxi("player")) then
        return 3
    elseif (IsMounted()) then
        return 2
    else
        return 1
    end
end

local function recordPosition()
    local mapId = C_Map.GetBestMapForUnit("player")
    local isInstance = mapId == nil

    if (isInstance) then
        local _, _, _, _, _, _, _, instanceId = GetInstanceInfo()
        mapId = instanceId
    end

    local coordinates
    if (not isInstance) then
        coordinates = module:getSourceCoordinates(mapId)
    end

    local coordinateEntry = {
        timestamp = time(),
        sourcePlayer = UnitName("player"),
        -- I genuinely hate adding this data here because it's almost never going to be useful... someone will almost certainly have
        -- had their data initialized by killing at least ONE thing before sending us positional data. But it is not a guaranteed thing
        sourcePlayerData = module:getPlayerData(UnitGUID("player")),
        realm = GetRealmName(),
        coordinates = coordinates,
        isInstance = isInstance,
        movementType = getMovementType(),
        mapId = mapId
    }

    if (NewPositionPoints == nil) then
        NewPositionPoints = {}
    end

    table.insert(NewPositionPoints, coordinateEntry)
end

local frame = CreateFrame("Frame")
frame.elapsed = 60
frame:SetScript("OnUpdate", function(self, sinceLastUpdate)
    self.elapsed = self.elapsed - sinceLastUpdate
    if self.elapsed > 0 then
        return
    end

    self.elapsed = 30
    recordPosition()
end);

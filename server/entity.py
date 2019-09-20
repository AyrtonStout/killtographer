class InputEntity:
    def __init__(self, raw_data):
        self.name = raw_data['name']
        self.entity_type = raw_data['entityType']
        self.pet_owner = raw_data['petOwner']
        self.realm = raw_data['realm']
        self.source_player = raw_data.get('source_player', False)

        if raw_data.get('additionalData') is not None:
            additional_data = raw_data['additionalData']
            self.race_id = additional_data['race']
            self.gender_id = additional_data['gender']
            self.class_id = additional_data['class']

    def __key(self):
        return self.name, self.entity_type, self.pet_owner, self.realm

    def __hash__(self):
        return hash(self.__key())

    def __eq__(self, other):
        if isinstance(other, InputEntity):
            return self.__key() == other.__key()
        return NotImplemented

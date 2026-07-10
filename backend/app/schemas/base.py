from pydantic import BaseModel, ConfigDict

class BaseSchema(BaseModel):
    """
    Common base schema with standard Pydantic ConfigDict settings.
    - from_attributes=True allows loading schemas from ORM or DB objects.
    - populate_by_name=True allows using alias names (like camelCase) in generation.
    """
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

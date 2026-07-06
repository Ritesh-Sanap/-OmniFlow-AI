from pydantic import BaseModel

class UserCommand(BaseModel):
    command: str
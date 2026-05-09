const createUserDto = (dto) => ({
  name: dto.name,
  email: dto.email
});

const userResponseDto = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email
});

module.exports = {
  createUserDto,
  userResponseDto
};
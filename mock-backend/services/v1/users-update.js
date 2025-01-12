const __avatars = require('../../database/avatars')

const putUser = (avatarId) => {
    const newAvatar = __avatars.find(av => av.id === avatarId)

    if(!newAvatar){
        return {
            message: "The selected avatar doesn't exist."
        }
    }

    return {
            message: "User updated successfully."
        };
}


module.exports = {
    putUser
}
  
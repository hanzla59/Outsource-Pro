class UserDTO{
    constructor(user){
        this.id = user.id;
        this.name = user.name;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
        this.skills = user.skills;
        this.bio = user.bio;
        this.hourlyrate = user.hourlyrate;
    }
}
module.exports = UserDTO;
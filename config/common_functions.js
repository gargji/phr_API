module.exports.generatePass = () => { 
    var specials = '!@#$%^&*~';
    var lowercase = 'abcdefghijklmnopqrstuvwxyz';
    var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var numbers = '0123456789';
    var all = specials + lowercase + uppercase + numbers;
    var password = '';
    password += specials[Math.floor(Math.random() * specials.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += all[Math.floor(Math.random() * all.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += all[Math.floor(Math.random() * all.length)];
    return password;
}


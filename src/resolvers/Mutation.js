async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.createUser({...args, password})
    const token = jwt.sign({userId: user.id}, "APP_SECRET");
    return {
        token,
        user
    }
}

async function login(parent, args, context, info) {
    const user = await context.prisma.user({email: args.email});
    if (!user) {
        throw new Error("No such user")
    }
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error("Invalid credential")
    }
    const token = jwt.sign({userId: user.id}, "APP_SECRET");
    return {
        token,
        user
    };
}

async function post(root, args, context) {
    return context.prisma.createLink({
        url: args.url,
        description: args.description
    });
}

module.exports = {
    login,
    signup,
    post
};
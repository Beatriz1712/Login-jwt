import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import UserManager from "../Mongo/UserManager.js";
import { UserModel } from "../dao/models/user.model.js";

const LocalStrategy = local.Strategy;
const userManager = new UserManager();
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { name, surname, email, role } = req.body;
        try {
          let user = await userManager.findEmail({ email: username });
          if (user) {
            return done(null, false, { message: "User already exists" });
          }
          const hashedPassword = await createHash(password);

          const newUser = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role,
          };
          let result = await userManager.addUser(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error getting the user", error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userManager.getUserById(id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userManager.findEmail({ email: username });
          console.log(`User del login: ${user}`);
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          const isValid = await isValidPassword(user, password);
          if (!isValid) {
            return done(null, false, { message: "Wrong password" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.9a829ee164297862",
        clientSecret: "a6dfc601851671f49e2ef628cd8ded8ee78bb715",
        callbackURL: "http://localhost:8080/api/users/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (profile.email && profile.email.length > 0) {
            const email = profile.email[0].value;
            let user = await userManager.findOne({ email: email });
            console.log(`User en passport use github: ${user}`);

            if (!user) {
              let newUser = {
                first_name: profile._json.name,
                last_name: "",
                email: email,
                password: "",
                role: "admin",
              };
              let result = await userManager.create(newUser);
              return done(null, result);
            } else {
              return done(null, user);
            }
          } else {
            return done(null, false, { message: "User not found in GitHub" });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;

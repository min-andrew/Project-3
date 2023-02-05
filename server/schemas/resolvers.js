const { AuthenticationError } = require('apollo-server-express');
const { User, Profile, VetNote, Habit } = require("../models");
const { signToken } = require("../utils/auth");
// const { GraphQLError } = require("graphql");
const resolvers = {
  Query: {
    profile: async () => {
      return await Profile.find();
    },

    vetNote: async (parent, { username }) => {
      const params = username ? { username } : {};
      return VetNote.find(params).sort({ createdAt: -1 });
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'vetNote.profile',
          populate: 'profile'
        });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
    getHabits: async () => {
      const habits = await Habit.find()
      return habits
    },
    profiles: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate('profile');

        return user.profile;
      }

      throw new AuthenticationError('Not logged in');
    },
    profile: async (parent, { _id }) => {
      return await Profile.findById(_id);
    },
    environment: async () => {
      return {
        cloudinaryApiName: process.env.REACT_APP_CLOUDINARY_API_NAME
      }
    }
  },
  Mutation: {
    addHabit: async (parent, args) => {
      const newHabit = new Habit({ habitName: args.habitName, frequency: args.frequency })
      await newHabit.save()
      console.log('The new habit has been added: ', newHabit)
      return newHabit
    },

    addHabit: async (parent, args, context) => {
      console.log(context);
      if (context.user) {
        const newHabit = await Habit.create(args);
        const addedHabit = await User.findByIdAndUpdate({ _id: context.user._id }, { $push: { newHabit: newHabit } }, { new: true });
        console.log('The new habit has been added: ', newHabit)
        return newHabit;
      }
      throw new AuthenticationError('Not logged in');
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    addVetNote: async (parent, args, context) => {
      console.log(context);
      if (context.user) {
        const vetNote = await VetNote.create(args);
        const addedVetNote = await User.findByIdAndUpdate({ _id: context.user._id }, { $push: { vetNote: vetNote } }, { new: true });
        return vetNote;
      }
      throw new AuthenticationError('Not logged in');
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw new AuthenticationError('Not logged in');
    },
    addProfile: async (parent, args, context) => {
      console.log(context);
      if (context.user) {
        const newProfile = await Profile.create(args);

        await User.findByIdAndUpdate(context.user._id, { $push: { profile: newProfile._id } });

        return newProfile;
      }

      throw new AuthenticationError('Not logged in');
    },
    updateProfile: async (parent, args, context) => {
      if (context.user) {
        return await Profile.findByIdAndUpdate(args._id, args);
      }

      throw new AuthenticationError('Not logged in');
    },
    removeProfile: async (parent, { profileId }, context) => {
      if (context.user) {
        return await Profile.findByIdAndRemove(profileId);
      }
    },
    //   updateVetNote: async (parent, { _id, quantity }) => {
    //     const decrement = Math.abs(quantity) * -1;

    //     return await VetNote.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
    //   },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    }

  }
};
module.exports = resolvers;
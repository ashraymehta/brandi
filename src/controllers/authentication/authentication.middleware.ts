import passport from 'passport';

export default () => {
  return passport.authenticate('bearer', {session: false});
};

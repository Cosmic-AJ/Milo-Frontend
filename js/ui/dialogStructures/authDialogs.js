export const signupDialog = [
  {
    text: "What is your name?",
    inputType: "name",
    placeholder: "Enter your name",
    keyName: "name",
    submitAfterInput: false,
  },
  {
    text: "What should we call you?",
    inputType: "username",
    placeholder: "Enter your username",
    keyName: "username",
    submitAfterInput: false,
  },
  {
    text: "Your email id is ...?",
    inputType: "email",
    placeholder: "Enter your email ID",
    keyName: "email",
    submitAfterInput: false,
  },
  {
    text: "What do you look like?",
    inputType: "avatar-picker",
    placeholder: "Choose Avatar",
    keyName: "avatar",
  },
  {
    text: "What is your password?",
    inputType: "password",
    placeholder: "Enter password",
    keyName: "password",
    submitAfterInput: true,
  },
];

export const loginDialog = [
  {
    text: "Your email id is ...?",
    inputType: "email",
    placeholder: "Enter your email ID",
    keyName: "email",
    submitAfterInput: false,
  },
  {
    text: "Tell me your secret code?",
    inputType: "password",
    placeholder: "Enter password",
    keyName: "password",
    submitAfterInput: true,
  },
];

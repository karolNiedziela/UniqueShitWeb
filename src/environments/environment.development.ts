export const environment = {
  production: false,
  apiUrl: 'https://localhost:5000/api/v1',
  adb2c: {
    clientId: 'ca92409d-9f71-4abb-9fc3-2a5a379aa60d',
    readScopeUrl:
      'https://uniqueshit.onmicrosoft.com/dev/uniqueshit/api/UniqueShit.Read',
    writeScopeUrl:
      'https://uniqueshit.onmicrosoft.com/dev/uniqueshit/api/UniqueShit.Write',
    scopeUrls: [
      'https://uniqueshit.onmicrosoft.com/dev/uniqueshit/api/UniqueShit.Read',
      'https://uniqueshit.onmicrosoft.com/dev/uniqueshit/api/UniqueShit.Write',
    ],
    authorityDomain: 'uniqueshit.b2clogin.com',
    signUpSignIn: 'B2C_1_signup_signin',
    signUpSignInAuthority:
      'https://uniqueshit.b2clogin.com/uniqueshit.onmicrosoft.com/B2C_1_signup_signin',
    resetPassword: 'B2C_1_password_reset',
    resetPasswordAuthority:
      'https://uniqueshit.b2clogin.com/uniqueshit.onmicrosoft.com/B2C_1_password_reset',
    editProfile: 'B2C_1_profile_edit',
    editProfileAuthority:
      'https://uniqueshit.b2clogin.com/uniqueshit.onmicrosoft.com/B2C_1_profile_edit',
  },
};

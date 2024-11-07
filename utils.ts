function generateRandomYopmail() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = 10; // Length of the random part of the email
  let randomString = '';

  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }

  return `${randomString}@yopmail.com`;
}

export {generateRandomYopmail};

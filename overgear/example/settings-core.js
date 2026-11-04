// The checks of the settings of an account: the password. A new password has 8 to 64 characters, with a letter and a digit, and is not the current one; the repeat must be the same. Each check returns the text of the error
// for its field, or an empty text. Pure functions: settings.jsx draws them.

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 64;

export const currentError = (current) => (String(current || '').length ? '' : 'Enter your current password');
export const newError = (next, current) => {
  const value = String(next || '');
  if (value.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters`;
  if (value.length > PASSWORD_MAX) return `Use at most ${PASSWORD_MAX} characters`;
  if (!/[a-z]/i.test(value) || !/\d/.test(value)) return 'Use a letter and a digit';
  if (value === current) return 'The new password must differ from the current one';
  return '';
};
export const repeatError = (next, repeat) => (String(repeat || '') === String(next || '') ? '' : 'The passwords do not match');

/** The errors of the three fields of the form: { current, next, repeat }, each an empty text when the field is right. */
export const passwordErrors = ({ current, next, repeat }) => ({ current: currentError(current), next: newError(next, current), repeat: repeatError(next, repeat) });
export const passwordValid = (values) => Object.values(passwordErrors(values)).every((e) => !e);

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
/** The problem of a file chosen for the avatar, or an empty text when it will do: an image of 5 MB at most. */
export const avatarError = (file) => {
  if (!file) return 'Choose a picture';
  if (!String(file.type || '').startsWith('image/')) return 'Choose an image file';
  if (file.size > AVATAR_MAX_BYTES) return 'The picture is larger than 5 MB';
  return '';
};


export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUser = (user) => {
  if (!user.name || !user.email || !user.password || !user.role) {
    return false;
  }
  return validateEmail(user.email) && validatePassword(user.password);
};

export const sanitizeData = (data) => {
  if (!data) return null;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

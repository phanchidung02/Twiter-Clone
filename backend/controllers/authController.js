async function signUp(req, res) {
  try {
    res.status(201).json({
      status: 'success',
      data: 'Sign up',
    });
  } catch (err) {}
}

async function login(req, res) {
  try {
    res.status(201).json({
      status: 'success',
      data: 'login',
    });
  } catch (err) {}
}

async function logout(req, res) {
  try {
    res.status(201).json({
      status: 'success',
      data: 'logout',
    });
  } catch (err) {}
}

export { signUp, login, logout };

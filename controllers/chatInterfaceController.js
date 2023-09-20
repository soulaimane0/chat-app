export const showChatInterface = (req, res) => {
  const username = req.user.username;
  res.render('chat_interface', { username: username });
};

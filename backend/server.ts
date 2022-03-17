import app from ".";

const PORT = process.env.PORT || 3000;

/**
 * Server Activation
 */

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

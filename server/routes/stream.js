const { Router} = require("express");
const router = Router();

router.get('/info', (req, res) => {
  res.send('stream route ok');
});

module.exports = router;
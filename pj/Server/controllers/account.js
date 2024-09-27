const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

module.exports = function (conn) {
  router.post("/changePassword", decodeToken(), async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userNo = req.user_no; // decodeToken 미들웨어에서 가져온 user_no

    try {
      // 1. 현재 비밀번호 확인을 위한 쿼리
      const [userPassword] = await conn.query(
        "SELECT password FROM Password WHERE user_no = ?",
        [userNo]
      );

      if (!userPassword) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }

      // 2. 현재 비밀번호가 일치하는지 확인
      if (userPassword.password !== currentPassword) {
        return res
          .status(400)
          .json({ message: "입력한 현재 비밀번호가 일치하지 않습니다." });
      }

      // 4. 새 비밀번호와 기존 비밀번호가 동일한지 확인
      if (newPassword === currentPassword) {
        return res.status(400).json({
          message: "새 비밀번호는 기존 비밀번호와 다르게 설정해야 합니다.",
        });
      }

      // 5. 비밀번호 업데이트 쿼리 ()
      await conn.query(
        "UPDATE Password SET password = ?, update_date = NOW() WHERE user_no = ?",
        [newPassword, userNo]
      );

      res
        .status(200)
        .json({ message: "비밀번호가 성공적으로 변경되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  });

  router.post("/loginLog", decodeToken(), async (req, res) => {
    const userNo = req.user_no; // decodeToken에서 얻은 user_no

    try {
      // 1. 로그인 로그를 가져오는 쿼리
      const [loginLogs] = await conn.query(
        "SELECT log_id, login_time, login_status FROM LoginLog WHERE user_id = ? ORDER BY log_id DESC",
        [userId]
      );

      // 2. 로그가 없을 경우 처리
      if (loginLogs.length === 0) {
        return res.status(404).json({ message: "로그인 로그가 없습니다." });
      }

      // 3. 로그인 로그 응답
      res.status(200).json({ loginLogs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  });

  return router;
};

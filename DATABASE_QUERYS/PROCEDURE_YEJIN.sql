
-- DROP PROCEDURE IF EXISTS UpdateUserBoard;
DELIMITER //
-- UserBoard 값을 클라이언트에서 선택한값으로 insert 하는 프로시저
CREATE PROCEDURE UpdateUserBoard(
    IN p_user_no INT,
    IN p_board_ids JSON
)
BEGIN
    -- 트랜잭션 시작
    START TRANSACTION;

    -- 기존 사용자 게시판 데이터 삭제
    DELETE FROM UserBoard
    WHERE user_no = p_user_no
      AND board_info_id NOT IN (
        SELECT value
        FROM JSON_TABLE(p_board_ids, '$[*]' COLUMNS (value INT PATH '$')) AS jt
    );

    -- 새로운 게시판 데이터 삽입
    INSERT INTO UserBoard (user_no, board_info_id)
    SELECT p_user_no, value
    FROM JSON_TABLE(p_board_ids, '$[*]' COLUMNS (value INT PATH '$')) AS jt
    ON DUPLICATE KEY UPDATE board_info_id = VALUES(board_info_id);

    -- 트랜잭션 커밋
    COMMIT;
END //

DELIMITER ;

-- 프로시터 테스트
 -- CALL UpdateUserBoard(1, '[1,2,3]');
-- select board_info_id from userboard where user_no=1;
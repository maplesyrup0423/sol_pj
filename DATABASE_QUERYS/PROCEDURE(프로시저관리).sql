-- 프로시저 삭제
DROP PROCEDURE IF EXISTS RegisterUser;

DELIMITER $$

CREATE PROCEDURE RegisterUser(
    IN p_user_id VARCHAR(256),
    IN p_nickname VARCHAR(50),
    IN p_image_url VARCHAR(128),
    IN p_introduce VARCHAR(256),
    IN p_gender INT,
    IN p_phone VARCHAR(128),
    IN p_email VARCHAR(128),
    IN p_birthdate VARCHAR(128),
    IN p_address VARCHAR(128),
    IN p_password VARCHAR(128),
    IN p_salt VARCHAR(128)
)
BEGIN
    DECLARE v_user_no INT;
    
    -- 트랜잭션 시작
    START TRANSACTION;
    
    -- User 테이블에 삽입
    INSERT INTO User (user_id) VALUES (p_user_id);
    SET v_user_no = LAST_INSERT_ID();
    
    -- UserProfile 테이블에 삽입
    INSERT INTO UserProfile (user_no, nickname, image_url, introduce) 
    VALUES (v_user_no, p_nickname, p_image_url, p_introduce);
    
    -- Authentic 테이블에 삽입
    INSERT INTO Authentic (user_no, gender, phone, email, birthdate, address, auth_date) 
    VALUES (v_user_no, p_gender, p_phone, p_email, p_birthdate, p_address, NOW());
    
    -- Password 테이블에 삽입
    INSERT INTO Password (user_no, password, salt, update_date) 
    VALUES (v_user_no, p_password, p_salt, NOW());
    
    -- 트랜잭션 커밋
    COMMIT;
END$$

DELIMITER ;
 -- 채팅방 생성 프로시저
 -- 채팅방 생성 프로시저
DELIMITER $$

CREATE PROCEDURE createChatRoom(
    IN creator_user_no INT,
    IN room_name VARCHAR(255),
    IN user_list JSON
)
BEGIN
    DECLARE new_room_id BIGINT;
    DECLARE user_index INT DEFAULT 0;
    DECLARE total_users INT;
    DECLARE is_group BOOLEAN;

    -- user_list의 길이를 확인하여 그룹 여부 결정
    SET is_group = JSON_LENGTH(user_list) > 1;

    -- ChatRoom에 새 채팅방 생성
    INSERT INTO ChatRoom (room_name, is_group, created_at)
    VALUES (room_name, is_group, NOW());
    
    -- 새로 생성된 room_id 가져오기
    SET new_room_id = LAST_INSERT_ID();
    
    -- 총 사용자 수 계산 (본인을 포함해야 하므로 +1)
    SET total_users = JSON_LENGTH(user_list) + 1;

    -- 먼저 만든 사람 (방장) 추가
    INSERT IGNORE INTO ChatRoomUser (room_id, user_no, role, joined_at)
    VALUES (new_room_id, creator_user_no, 'admin', NOW());

    -- 나머지 사용자 추가
    WHILE user_index < JSON_LENGTH(user_list) DO
        -- user_list에서 사용자 번호 가져오기
        SET @user_no = JSON_UNQUOTE(JSON_EXTRACT(user_list, CONCAT('$[', user_index, ']')));

        -- 사용자 추가 (중복 시 무시)
        INSERT IGNORE INTO ChatRoomUser (room_id, user_no, role, joined_at)
        VALUES (new_room_id, @user_no, 'member', NOW());

        -- 다음 사용자로 이동
        SET user_index = user_index + 1;
        


    END WHILE;
    SELECT new_room_id AS room_id;
END$$

DELIMITER ;




-- DROP PROCEDURE IF EXISTS UpdateUserBoard;
-- 커스텀 게시판 관련 프로시저
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


SHOW PROCEDURE STATUS WHERE Db = 'sol';




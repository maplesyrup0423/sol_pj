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
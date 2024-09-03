-- 해당 DB에서 모든 테이블 삭제
USE sol;

-- 모든 테이블의 목록을 가져와서 동적으로 DROP TABLE 명령어 생성
SET @tables = NULL;
SELECT GROUP_CONCAT(table_name) INTO @tables
FROM information_schema.tables
WHERE table_schema = 'sol';

SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);
PREPARE stmt FROM @tables;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

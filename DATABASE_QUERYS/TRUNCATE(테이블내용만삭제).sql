USE sol;

-- 테이블 구조는 그대로 놔두고 안의 내용물만 삭제하고 싶을 경우 이 쿼리 사용--

SET FOREIGN_KEY_CHECKS = 0;

-- 모든 테이블의 데이터만 삭제하는 쿼리 생성
SELECT CONCAT('TRUNCATE TABLE `', table_name, '`;')
FROM information_schema.tables
WHERE table_schema = 'your_database_name';

SET FOREIGN_KEY_CHECKS = 1;
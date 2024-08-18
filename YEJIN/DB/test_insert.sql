USE sol;

INSERT INTO User VALUES(1,'예진');
INSERT INTO User VALUES(2,'일진');
INSERT INTO User VALUES(3,'한결');
INSERT INTO User VALUES(4,'유한');
INSERT INTO User VALUES(5,'주영');
INSERT INTO User VALUES(6,'요한');

INSERT INTO board_info_table VALUES(1,'롤',null);
INSERT INTO board_info_table VALUES(2,'로아',null);
INSERT INTO board_info_table VALUES(3,'배그',null);

INSERT INTO posts VALUES(null,'내용1','이미지1','이미지2','이미지3','이미지4',1,NOW(),null,1,0,0,0);
INSERT INTO posts VALUES(null,'내용2','이미지1',null,null,NULL,2,NOW(),null,1,0,0,0);
INSERT INTO posts VALUES(null,'내용3',NULL,NULL,NULL,NULL,3,NOW(),null,2,0,0,0);
INSERT INTO posts VALUES(null,'내용4','이미지1','이미지2','이미지3','이미지4',4,NOW(),null,3,0,0,0);

INSERT INTO comments VALUES(NULL,1,NULL,'댓글1',5,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,1,'대댓글1',2,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,2,'대댓글의 대댓글',5,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,NULL,'댓글2',4,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,4,'대댓글2-1',5,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,4,'대댓글2-2',1,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,6,'대댓들의 대댓글',5,NOW(),NULL,0,0);
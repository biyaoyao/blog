/*
Navicat MySQL Data Transfer

Source Server         : biyaoyao.com
Source Server Version : 50544
Source Host           : 203.195.150.220:3306
Source Database       : db_blue

Target Server Type    : MYSQL
Target Server Version : 50544
File Encoding         : 65001

Date: 2015-12-18 10:08:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tb_articel_comment
-- ----------------------------
DROP TABLE IF EXISTS `tb_articel_comment`;
CREATE TABLE `tb_articel_comment` (
  `comment_id` int(4) NOT NULL AUTO_INCREMENT,
  `article_id` int(4) NOT NULL,
  `user` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `comment` longtext COLLATE utf8_bin,
  `comment_time` varchar(19) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `aid` (`article_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for tb_article
-- ----------------------------
DROP TABLE IF EXISTS `tb_article`;
CREATE TABLE `tb_article` (
  `article_id` int(4) NOT NULL AUTO_INCREMENT,
  `type_id` int(4) NOT NULL,
  `title` varchar(40) COLLATE utf8_bin NOT NULL,
  `author` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `content` longtext COLLATE utf8_bin NOT NULL,
  `create_time` varchar(19) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`article_id`),
  KEY `tid` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for tb_article_scan
-- ----------------------------
DROP TABLE IF EXISTS `tb_article_scan`;
CREATE TABLE `tb_article_scan` (
  `scan_id` int(5) NOT NULL AUTO_INCREMENT,
  `article_id` int(5) DEFAULT NULL,
  `ip` varchar(20) DEFAULT NULL,
  `country` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `area` varchar(20) DEFAULT NULL,
  `province` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `city` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `ip_type` varchar(20) DEFAULT NULL,
  `scan_time` datetime DEFAULT NULL,
  PRIMARY KEY (`scan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for tb_article_type
-- ----------------------------
DROP TABLE IF EXISTS `tb_article_type`;
CREATE TABLE `tb_article_type` (
  `type_id` int(5) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(12) DEFAULT NULL,
  `type_desc` varchar(12) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for tb_img
-- ----------------------------
DROP TABLE IF EXISTS `tb_img`;
CREATE TABLE `tb_img` (
  `img_id` int(4) NOT NULL AUTO_INCREMENT,
  `image_type_id` int(4) DEFAULT NULL,
  `img_desc` text COLLATE utf8_bin,
  `img_url` text COLLATE utf8_bin,
  `create_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`img_id`),
  KEY `typeid` (`image_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for tb_img_type
-- ----------------------------
DROP TABLE IF EXISTS `tb_img_type`;
CREATE TABLE `tb_img_type` (
  `image_type_id` int(4) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `type_desc` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`image_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for tb_leave_msg
-- ----------------------------
DROP TABLE IF EXISTS `tb_leave_msg`;
CREATE TABLE `tb_leave_msg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `content` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `create_time` varchar(19) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for tb_login
-- ----------------------------
DROP TABLE IF EXISTS `tb_login`;
CREATE TABLE `tb_login` (
  `id` int(4) NOT NULL,
  `username` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(32) COLLATE utf8_bin DEFAULT NULL COMMENT 'md5加密',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for tb_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `tb_userinfo`;
CREATE TABLE `tb_userinfo` (
  `id` int(4) NOT NULL,
  `login_id` int(4) DEFAULT NULL,
  `real_name` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `sex` varchar(8) COLLATE utf8_bin DEFAULT NULL,
  `birthday` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `birth_place` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `live_place` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `regist_time` varchar(19) COLLATE utf8_bin DEFAULT NULL,
  `last_login_time` varchar(19) COLLATE utf8_bin DEFAULT NULL,
  `introduce` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `photo` text COLLATE utf8_bin,
  PRIMARY KEY (`id`),
  KEY `loginid` (`login_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for tb_visit
-- ----------------------------
DROP TABLE IF EXISTS `tb_visit`;
CREATE TABLE `tb_visit` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `ip` varchar(40) COLLATE utf8_bin DEFAULT NULL,
  `country` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `area` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `province` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `city` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `ip_type` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `visit_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1451 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

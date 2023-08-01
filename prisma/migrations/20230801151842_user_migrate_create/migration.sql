-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` CHAR(200) NOT NULL,
    `email` CHAR(100) NOT NULL,
    `cpf` CHAR(14) NOT NULL,
    `age` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL,
    `password` CHAR(32) NOT NULL,

    UNIQUE INDEX `user_id_key`(`id`),
    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

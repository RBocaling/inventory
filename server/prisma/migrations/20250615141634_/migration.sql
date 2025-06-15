-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'OWNER', 'EMPLOYEE') NOT NULL,
    `isDeleted` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `updatedOn` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `remainingStock` INTEGER NULL,
    `buyingPrice` DOUBLE NOT NULL,
    `sellingPrice` DOUBLE NOT NULL,
    `source` VARCHAR(191) NULL,
    `isDeleted` BOOLEAN NULL,
    `isLowStock` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `originalStockAdded` INTEGER NOT NULL,
    `addedBy` VARCHAR(191) NOT NULL,
    `updatedOn` DATETIME(3) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,
    `orderDate` DATETIME(3) NOT NULL,
    `netTotal` DOUBLE NOT NULL,
    `paid` DOUBLE NOT NULL,
    `due` DOUBLE NOT NULL,
    `status` ENUM('Pending', 'Completed', 'Partial') NOT NULL,
    `paymentType` VARCHAR(191) NULL,
    `referenceNumber` VARCHAR(191) NULL,
    `updatedOn` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NULL,

    UNIQUE INDEX `Sale_invoice_key`(`invoice`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductHistory` ADD CONSTRAINT `ProductHistory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropIndex
DROP INDEX `sessions_token_idx` ON `sessions`;

-- CreateIndex
CREATE INDEX `sessions_token_idx` ON `sessions`(`token`);

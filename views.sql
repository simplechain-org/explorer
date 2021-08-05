CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `blocks` AS
select
`blocks`.`number` AS `number`,
`blocks`.`difficulty` AS `difficulty`,
concat('0x',lower(hex(`blocks`.`extraData`))) AS `extraData`,
`blocks`.`gasLimit` AS `gasLimit`,`blocks`.`gasUsed` AS `gasUsed`,
concat('0x',lower(hex(`blocks`.`hash`))) AS `hash`,
concat('0x',lower(hex(`blocks`.`logsBloom`))) AS `logsBloom`,
concat('0x',lower(hex(`blocks`.`miner`))) AS `miner`,
concat('0x',lower(hex(`blocks`.`mixHash`))) AS `mixHash`,
concat('0x',lower(hex(`blocks`.`nonce`))) AS `nonce`,
concat('0x',lower(hex(`blocks`.`parentHash`))) AS `parentHash`,
concat('0x',lower(hex(`blocks`.`receiptsRoot`))) AS `receiptsRoot`,
concat('0x',lower(hex(`blocks`.`sha3Uncles`))) AS `sha3Uncles`,
`blocks`.`size` AS `size`,
concat('0x',lower(hex(`blocks`.`stateRoot`))) AS `stateRoot`,
`blocks`.`timestamp` AS `timestamp`,
concat('0x',lower(hex(`blocks`.`totalDifficulty`))) AS `totalDifficulty`,
concat('0x',lower(hex(`blocks`.`transactionsRoot`))) AS `transactionsRoot`,
`blocks`.`unclesCount` AS `unclesCount`,
`blocks`.`uncleInclusionRewards` AS `uncleInclusionRewards`,
`blocks`.`txnFees` AS `txnFees`,
`blocks`.`minerReward` AS `minerReward`,
`blocks`.`foundation` AS `foundation`
from `t_blocks` `blocks`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `transactions` AS
select concat('0x',lower(hex(`transactions`.`blockHash`))) AS `blockHash`,
`transactions`.`blockNumber` AS `blockNumber`,
concat('0x',lower(hex(`transactions`.`hash`))) AS `hash`,
concat('0x',lower(hex(`transactions`.`from`))) AS `from`,
`transactions`.`gas` AS `gas`,`transactions`.`gasUsed` AS `gasUsed`,
`transactions`.`gasPrice` AS `gasPrice`,
concat('0x',lower(hex(`transactions`.`input`))) AS `input`,
`transactions`.`nonce` AS `nonce`,concat('0x',
    lower(hex(`transactions`.`to`))) AS `to`,
`transactions`.`transactionIndex` AS `transactionIndex`,
`transactions`.`value` AS `value`,
`transactions`.`status` AS `status`
from `t_transactions` `transactions`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `uncles` AS
select
`uncles`.`blockNumber` AS `blockNumber`,
`uncles`.`number` AS `number`,
`uncles`.`difficulty` AS `difficulty`,
concat('0x',convert(lower(hex(`uncles`.`extraData`)) using utf8mb4)) AS `extraData`,
`uncles`.`gasLimit` AS `gasLimit`,
`uncles`.`gasUsed` AS `gasUsed`,
concat('0x',convert(lower(hex(`uncles`.`hash`)) using utf8mb4)) AS `hash`,
concat('0x',convert(lower(hex(`uncles`.`logsBloom`)) using utf8mb4)) AS `logsBloom`,
concat('0x',convert(lower(hex(`uncles`.`miner`)) using utf8mb4)) AS `miner`,
concat('0x',convert(lower(hex(`uncles`.`mixHash`)) using utf8mb4)) AS `mixHash`,
concat('0x',convert(lower(hex(`uncles`.`nonce`)) using utf8mb4)) AS `nonce`,
concat('0x',convert(lower(hex(`uncles`.`parentHash`)) using utf8mb4)) AS `parentHash`,
concat('0x',convert(lower(hex(`uncles`.`receiptsRoot`)) using utf8mb4)) AS `receiptsRoot`,
concat('0x',convert(lower(hex(`uncles`.`sha3Uncles`)) using utf8mb4)) AS `sha3Uncles`,
`uncles`.`size` AS `size`,
concat('0x',convert(lower(hex(`uncles`.`stateRoot`)) using utf8mb4)) AS `stateRoot`,
`uncles`.`timestamp` AS `timestamp`,
concat('0x',convert(lower(hex(`uncles`.`transactionsRoot`)) using utf8mb4)) AS `transactionsRoot`,
`uncles`.`uncleIndex` AS `uncleIndex`,`uncles`.`reward` AS `reward`
from `t_uncles` `uncles`;

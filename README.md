# Manta Claim scripts

### Quick start

[Airdrop](https://airdrop.manta.network/)

``` bash
# .env
WALLET_PRIVATEKEY=0x6623c5f41a4b295f5fadc4069a05c5d4166a558ba0a7c62e0e781bd0c1d325b3
```

```js
const wallet = new Wallet(process.env.WALLET_PRIVATEKEY);
const manta = new MantaAirdrop(wallet);

await manta.claim();
```

``` bash
pnpm install

pnpm run start
```

# 免责声明

该项目是一个开源项目，您可以自由使用、修改和分发。然而，请注意以下事项：

1. 该项目的所有代码、文档和其他内容是按原样提供的，没有任何形式的明示或暗示的保证。作者对代码的适用性、可靠性和安全性不作任何保证。

2. 作者对于因使用该项目而导致的任何损失或损害概不负责，包括但不限于直接、间接、偶然、特殊或后果性的损失。

3. 作者不承担任何修复或维护的责任。使用者有责任对代码进行充分的测试和验证。

4. 作者保留拒绝对任何问题提供支持或解决方案的权利。

5. 任何人在使用该项目时，应当遵循适用的法律和法规，以及第三方的权利和许可要求。

通过使用该项目，您表明您已经阅读、理解并接受了这些免责声明。

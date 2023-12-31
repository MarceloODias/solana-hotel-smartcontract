### Instalacao de ambiente local Solana

### OBS:
Caso esteja usando Windows baixar o WSL e rodar todos os comandos nele:

```bash
wsl --install
```

### Intalar Node.js

```
Instalar Curl
sudo apt-get install curl

Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

Reiniciar Terminal Ubuntu 

Instalar Node.js
nvm install --lts

### Instalar Rust

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

### Instalar Solana

```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.10.32/install)"

Despois de instalado criar conta

```bash
 solana-keygen new
```

Configurar CLI para usar nova conta:

```bash
solana config set --keypair /root/.config/solana/id.json
```
Lincar conta com a devnet:

```bash
solana config set --url https://api.devnet.solana.com
```

### Pos Instalacao

Caso as tudo tenha sido instalado com successo vamos usar o comando abaixo para adicionar 1 sol a carteira

```bash
solana airdrop 1
```

Obs mesmo para realizacao de teste eh preciso ter sol na carteira, caso falte ou nao tenha o suficiente usar o comando acima novamente

É possivel ver os outros comandos da solano CLI usando

```bash
solana
```

### Testando

#### Compilar e implantar o Programa Rust:

```bash
cargo build-bpf --manifest-path=./mint/Cargo.toml --bpf-out-dir=./dist/program
solana program deploy dist/program/mint.so
```

#### Executar Dapp
```bash
npm install
yarn dev
```
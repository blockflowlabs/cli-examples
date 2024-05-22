interface AccountInfo{
    address: string
}

export const ACCOUNTS: Record<string, AccountInfo> = {
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f":{
    address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  }
}

export const getAccountMetadata = (account: string) => {
    const findedAccount = Object.keys(ACCOUNTS).filter(
      (accAddr) => accAddr.toLowerCase() === account.toLowerCase(),
    )
    return ACCOUNTS[findedAccount[0]]
  }
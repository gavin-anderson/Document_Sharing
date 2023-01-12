const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const documentSharingFactory = await hre.ethers.getContractFactory("DocumentSharing");
    const sharingContract = await documentSharingFactory.deploy();
    await sharingContract.deployed();
    console.log("Contract deployed to:", sharingContract.address);
    console.log("Contract deployed by:", owner.address);

    const addOwnerTxn = await sharingContract.addOwnership("url", 1);
    await addOwnerTxn.wait();

    await sharingContract.checkOwnership("url", 1);
    await sharingContract.connect(randomPerson).checkOwnership("url", 1);

    const addAccessTxn = await sharingContract.addAccess(randomPerson.address, "url", 1);
    await addAccessTxn.wait();

    await sharingContract.connect(randomPerson).checkAccess("url");

    const removeAccessTxn = await sharingContract.connect(owner).removeAccess(randomPerson.address, "url", 1);
    await removeAccessTxn.wait();

    await sharingContract.connect(randomPerson).checkAccess("url");

    const transferOwnerTxn = await sharingContract.connect(owner).transferOwnership(randomPerson.address, "url", 1);
    await transferOwnerTxn.wait();

    sharingContract.connect(randomPerson).checkOwnership("url", 1);
    console.log("Switch to new Owner")
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    // status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
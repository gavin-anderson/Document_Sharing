const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const documentSharingFactory = await hre.ethers.getContractFactory("DocumentSharing");
    const sharingContract = await documentSharingFactory.deploy();
    await sharingContract.deployed();
    console.log("Contract deployed to:", sharingContract.address);
    console.log("Contract deployed by:", owner.address);

    console.log("--------------------")
    console.log("Adding Ownership")

    const addOwnerTxn = await sharingContract.addOwnership("url", 1);
    await addOwnerTxn.wait();
    console.log("Finished adding Ownership")
    console.log("\n")

    console.log("--------------------")
    console.log("Checking Ownership of the real Owner")
    await sharingContract.checkOwnership("url", 1);
    console.log("Finished checking Ownership of the real Owner")
    console.log("\n")
    console.log("--------------------")
    console.log("Checking Ownership of second person's address")
    await sharingContract.connect(randomPerson).checkOwnership("url", 1);
    console.log("Finished checking ownership of second person's address")
    console.log("\n")
    console.log("--------------------")
    console.log("Adding access for second person's address")
    const addAccessTxn = await sharingContract.addAccess(randomPerson.address, "url", 1);
    await addAccessTxn.wait();
    console.log("Finished adding access for second person's address")
    console.log("\n")
    console.log("--------------------")
    console.log("Checking access for second person's address")
    if (await sharingContract.connect(randomPerson).checkAccess("url")) {
        console.log("second person has access")
    } else {
        console.log("second person does not have access")
    }

    console.log("Finished checking access for second person's address")
    console.log("\n")
    console.log("--------------------")
    console.log("Removing access for second person's address")
    const removeAccessTxn = await sharingContract.connect(owner).removeAccess(randomPerson.address, "url", 1);
    await removeAccessTxn.wait();
    console.log("Finished removing access for second person's address")
    console.log("\n")
    console.log("--------------------")
    console.log("Checking access for second person's address")
    if (await sharingContract.connect(randomPerson).checkAccess("url")) {
        console.log("second person has access")
    } else {
        console.log("second person does not have access")
    }
    console.log("Finished checking access for second person's address")
    console.log("\n")
    console.log("--------------------")
    console.log("Transferring ownership for second person's address")
    const transferOwnerTxn = await sharingContract.connect(owner).transferOwnership(randomPerson.address, "url", 1);
    await transferOwnerTxn.wait();
    console.log("Finished transferring ownership for second person's address")
    console.log("\n")
    console.log("--------------------")
    console.log("Checking ownership for second person's address")
    await sharingContract.connect(randomPerson).checkOwnership("url", 1);
    console.log("Finished checking ownership for second person's address")

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
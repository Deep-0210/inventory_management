[
    // Step 1: Lookup requestedVendor info from 'userdatas' collection
    {
        $lookup: {
            from: "userdatas",             // The collection we're joining from
            localField: "requestedId",     // Field in current collection (e.g., stock/request)
            foreignField: "_id",           // Field in 'userdatas' collection to match with
            as: "requestedVendor"          // Output array field to store matched documents
        }
    },

    // Step 2: Unwind requestedVendor to convert array into a single object
    {
        $unwind: {
            path: "$requestedVendor",       // The field to unwind
            preserveNullAndEmptyArrays: true // Keeps the document even if no match was found
        }
    },

    // Step 3: Lookup attendantVendor info from 'userdatas' collection
    {
        $lookup: {
            from: "userdatas",
            localField: "attendantId",      // Attendant ID in the current collection
            foreignField: "_id",            // Match it with the '_id' in userdatas
            as: "attendantVendor"
        }
    },

    // Step 4: Unwind attendantVendor
    {
        $unwind: {
            path: "$attendantVendor",
            preserveNullAndEmptyArrays: true
        }
    },

    // Step 5: Lookup the vendor who created the requested vendor
    {
        $lookup: {
            from: "userdatas",               // Join again from 'userdatas'
            let: { vendorRefId: "$requestedVendor.vendorRef" }, // Pass vendorRef from requestedVendor
            pipeline: [
                {
                    $match: {
                        $expr: { $eq: ["$_id", "$$vendorRefId"] } // Match _id with vendorRef
                    }
                }
            ],
            as: "createdVendor"
        }
    },

    // Step 6: Unwind createdVendor
    {
        $unwind: {
            path: "$createdVendor",
            preserveNullAndEmptyArrays: true
        }
    },

    // Step 7: Clean up output by removing unwanted fields from nested user objects
    {
        $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,

            "createdVendor._id": 0,
            "createdVendor.password": 0,
            "createdVendor.createdAt": 0,
            "createdVendor.updatedAt": 0,
            "createdVendor.__v": 0,

            "requestedVendor._id": 0,
            "requestedVendor.password": 0,
            "requestedVendor.createdAt": 0,
            "requestedVendor.updatedAt": 0,
            "requestedVendor.__v": 0,

            "attendantVendor._id": 0,
            "attendantVendor.password": 0,
            "attendantVendor.createdAt": 0,
            "attendantVendor.updatedAt": 0,
            "attendantVendor.__v": 0
        }
    }
]

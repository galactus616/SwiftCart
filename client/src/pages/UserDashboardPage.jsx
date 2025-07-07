import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiList, FiEdit, FiLogOut } from "react-icons/fi";

const UserDashboardPage = () => {
  const { user, logout, updateUserProfile } = useContext(AuthContext);
  const [loader, setLoader] = useState(false); // Corrected typo: setloader to setLoader
  const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (e) => { // Added async keyword
    setLoader(true); // Corrected typo: setloader to setLoader
    e.preventDefault();

    // Get the form data
    const from =e.target;
    const phone = from.phone?.value;
    console.log(phone);
    const address = from.address?.value;
    console.log(address);
  const profileData = {
    phone: phone,
    address: address, // Assuming 'address' is a field with a 'value'
  };
    try {
      await updateUserProfile(profileData); // Pass phone and address to updateUserProfile
      document.getElementById("my_modal_1").close(); // Close the modal on successful update
      alert("Profile updated successfully!"); // Optional: show a success message
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again."); // Optional: show an error message
    } finally {
      setLoader(false); // Corrected typo: setloader to setLoader
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Account
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b">
            <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center text-3xl font-bold">
              {user.name[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Profile Information
          </h3>
          <div className="space-y-4 mb-8">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Address:</span>{" "}
              {user.address || "Not set"}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Phone:</span>{" "}
              {user.phone || "Not set"}
            </p>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Account Actions
          </h3>
          <div className="flex gap-2">
            <Link
              to="/order-history"
              className="w-full py-3 bg-[#fd9404] text-white rounded-lg font-semibold hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FiList className="h-5 w-5" />
              My Orders
            </Link>
            <button
              onClick={() => document.getElementById("my_modal_1").showModal()}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              <FiEdit className="h-5 w-5" />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FiLogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
      {/* modal for profile update  */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-gray-50 flex flex-col justify-center">
          <h3 className="font-bold text-lg text-center">Profile Details</h3>

          <div className="modal-action flex justify-center ">
            <form
              method="dialog"
              onSubmit={handleSubmit}
              className="space-y-2 "
            >
              {/* name */}
              <div>
                <label
                  htmlFor="Name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="Name"
                  name="name"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring "
                  defaultValue={user.name}
                  readOnly
                />
              </div>
              {/* email  */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="Email"
                  name="email"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring "
                  defaultValue={user.email}
                  readOnly
                />
              </div>
              {/* mobile no  */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  phone
                </label>
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring "
                  defaultValue={user.phone}
                  placeholder="Enter mobile number"
                />
              </div>
              {/* address  */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <textarea
                  rows={4}
                  cols={3}
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring "
                  defaultValue={user.address}
                  placeholder="Enter address"
                />
                <section className="flex justify-end items-center gap-2">
                  <button type="submit" className="btn">
                    {loader ? (
                      <div className="disabled">
                        <span className="loading loading-spinner loading-xs"></span>
                      </div>
                    ) : (
                      <>Submit</>
                    )}
                  </button>
                </section>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UserDashboardPage;
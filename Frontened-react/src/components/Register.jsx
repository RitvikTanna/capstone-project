
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [preview, setPreview] = useState();

  const onSubmit = async (newUser) => {
    setLoading(true);
    // Create form data object
    const formData = new FormData();
    //get user object
    let { role, profileImageUrl, ...userObj } = newUser;
    //add all fields except profilePic to FormData object
    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });
    // add profilePic to Formdata object
    formData.append("profileImageUrl", profileImageUrl[0]);

    try {



      if (role === "user") {
        await axios.post(`${import.meta.env.VITE_API_URL}/user-api/users`, formData);
      }

      if (role === "author") {
        await axios.post(`${import.meta.env.VITE_API_URL}/author-api/users`, formData);
      }

      console.log("User registered successfully");

      // redirect after successful registration
      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-200">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-300 p-10 w-full md:w-600px] space-y-6"
      >

        <h1 className="text-3xl text-center font-semibold">Register</h1>

        {/* Role */}

        <div className="flex justify-center items-center gap-6">

          <span className="text-xl">Select Role</span>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="user"
              {...register("role", { required: "Select role" })}
            />
            User
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="author"
              {...register("role")}
            />
            Author
          </label>

        </div>

        <p className="text-red-500 text-center">{errors.role?.message}</p>

        {/* Name */}

        <div className="flex gap-4">

          <input
            placeholder="First name"
            className="bg-gray-400 p-3 w-full"
            {...register("firstName", { required: "First name required" })}
          />

          <input
            placeholder="Last name"
            className="bg-gray-400 p-3 w-full"
            {...register("lastName", { required: "Last name required" })}
          />

        </div>

        {/* Email */}

        <input
          placeholder="Email"
          className="bg-gray-400 p-3 w-full"
          {...register("email", { required: "Email required" })}
        />


        {/* {password} */}
        <input
          type="password"
          placeholder="Password"
          className="bg-gray-400 p-3 w-full"
          {...register("password", { required: "Password required" })}
        />


        {/* profile image */}

        <div>
          <label >Profile image url</label>

          <input
            type="file"
            accept="image/png, image/jpeg"
            {...register("profileImageUrl")}
            onChange={(e) => {

              //get image file
              const file = e.target.files[0];
              // validation for image format
              if (file) {
                if (!["image/jpeg", "image/png"].includes(file.type)) {
                  setError("Only JPG or PNG allowed");
                  return;
                }
                //validation for file size
                if (file.size > 2 * 1024 * 1024) {
                  setError("File size must be less than 2MB");
                  return;
                }
                //Converts file → temporary browser URL(create preview URL)
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
                setError(null);
              }

            }} />
          {preview && (
            <div className="mt-3 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full border"
              />
            </div>
          )}




        </div>



        <button className="bg-blue-400 px-8 py-3 block mx-auto">
          Submit
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

      </form>

    </div>

  );
}

export default Register;


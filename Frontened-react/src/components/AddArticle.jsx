import { useForm } from "react-hook-form"

function AddArticle(){

const {register,handleSubmit,formState:{errors}} = useForm()

const onSubmit=(data)=>{
 console.log(data)
}

return(

<div className="min-h-screen flex justify-center items-center bg-gray-200">

<form
onSubmit={handleSubmit(onSubmit)}
className="bg-gray-300 p-10 w-full md:w-600px space-y-6">

<h1 className="text-3xl text-center font-semibold">Add Article</h1>

<input
placeholder="Title"
className="bg-gray-400 p-3 w-full"
{...register("title",{required:"Title required"})}
/>

<select
className="bg-gray-400 p-3 w-full"
{...register("category",{required:"Select category"})}
>
<option value="">Category</option>
<option>Technology</option>
<option>Sports</option>
<option>Education</option>
</select>

<textarea
rows="6"
placeholder="Content"
className="bg-gray-400 p-3 w-full"
{...register("content",{required:"Content required"})}
/>

<button className="bg-blue-400 px-8 py-3 block mx-auto">
Publish Article
</button>

</form>

</div>

)
}

export default AddArticle

const Error = () => {
    return (
        <div className='w-full h-screen flex items-center justify-center bg-gray-950 p-4'>
            <div className='w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center text-red-600 text-3xl font-semibold'>
                Oops ! Something went wrong while waking up the servers. Please try again later.
            </div>
        </div>
    )
}

export default Error
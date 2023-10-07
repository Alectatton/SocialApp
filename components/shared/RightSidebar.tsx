import { currentUser } from "@clerk/nextjs";
import { fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/UserCard";

const RightSidebar = async() => {
    const user = await currentUser();
    if(!user) return null;

    const result = await fetchUsers({
        userId: user.id,
        search: '',
        pageNumber: 1,
        pageSize: 20,
    });


    return (
        <section className="custom-scrollbar rightsidebar">
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">
                    Suggested Users
                </h3>

                <div className="mt-14 flex flex-col gap-9">
                {
                    result.users.length === 0 ? (
                        <p className="no-result">
                            No users found
                        </p>
                    ) : (
                        <>
                            {
                                result.users.map((person) => (
                                    <UserCard 
                                        key={person.id}
                                        id={person.id}
                                        name={person.name}
                                        username={person.username}
                                        imgUrl={person.image}
                                        personType='User'
                                    />
                                ))
                            }
                        </>
                    )
                }
                </div>
            </div>
        </section>
    )
}

export default RightSidebar
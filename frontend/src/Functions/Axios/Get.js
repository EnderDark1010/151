
export async function get(){
        const token = await getAccessTokenSilently();
  
        const response = await fetch(`http://localhost:5000/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
}
import {useParams} from 'react-router-dom';

const PostDetail = () => {
    const { id } = useParams();
    console.log(">> check param from url: ", id);
    return (
        <div>
            POST DETAIL
        </div>
    )
}
export default PostDetail;
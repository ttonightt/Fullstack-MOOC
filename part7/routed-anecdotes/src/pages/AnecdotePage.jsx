
const AnecdotePage = ({ anecdote, onVote }) => {

    const {id, author, content, url, votes} = anecdote;

    if (anecdote)
        return (
            <div>
                <h2>{content} by {author}</h2>
                <button onClick={() => onVote(id)}>Vote</button>
                <p>has {votes} {votes > 1 ? "votes" : "vote"}</p>
                <p>for more information visit <a href={url}>{url}</a></p>
            </div>
        );
};

export default AnecdotePage;
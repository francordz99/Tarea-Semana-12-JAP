function loadComments() {
    const productID = localStorage.getItem('productID');
    const url = `../sources/comments.json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const comments = data.pagina_pokemon.comentarios;
            const commentContainer = document.getElementById('comment-list');
            const commentForm = document.getElementById('new-comment-form');

            const commentList = document.createElement('div');
            commentList.classList.add("list-group");

            commentContainer.appendChild(commentList);

            comments.forEach(comment => {
                const formattedUser = comment.usuario.replace(/_/g, ' ');

                const starHTML = Array(5).fill('').map((_, index) => `
                    <span class="fa fa-star ${index < comment.rating ? 'checked' : 'unchecked'}"></span>
                `).join('');

                const commentItem = document.createElement('div');
                commentItem.classList.add("list-group-item");
                commentItem.classList.add("commits");

                commentItem.innerHTML = `
                    <p><strong>${formattedUser}</strong> - ${comment.fecha} - ${starHTML}</p>
                    <p>${comment.contenido}</p>
                `;

                commentList.appendChild(commentItem);
            });

            commentForm.style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar los comentarios:', error);
        });
}



function addComment(event) {
    event.preventDefault();

    const selectedStar = document.querySelector('.star-rating');
    const score = parseInt(selectedStar.value);
    const username = document.getElementById('user-text').value;
    const description = document.getElementById('comment-text').value;
    const dateTime = new Date().toLocaleString();
    const newComment = {
        usuario: username,
        fecha: dateTime,
        contenido: description,
        rating: score
    };

    let comments = JSON.parse(localStorage.getItem('comments')) || [];

    comments.push(newComment);

    localStorage.setItem('comments', JSON.stringify(comments));

    displayComment(newComment);

    document.getElementById('comment-text').value = '';
}

function displayComment(comment) {
    const commentList = document.getElementById('comment-list');
    const commentItem = document.createElement('div');

    commentItem.classList.add("list-group-item");
    commentItem.classList.add("commits");

    const starHTML = Array(5).fill('').map((_, index) => `
        <span class="fa fa-star ${index < comment.rating ? 'checked' : 'unchecked'}"></span>
    `).join('');

    commentItem.innerHTML = `
        <p><strong>${comment.usuario}</strong> - ${comment.fecha} - ${starHTML}</p>
        <p>${comment.contenido}</p>
    `;

    commentList.appendChild(commentItem);
}

document.addEventListener('DOMContentLoaded', () => {
    loadComments();

    const commentForm = document.getElementById('new-comment-form');
    commentForm.addEventListener('submit', addComment);
});

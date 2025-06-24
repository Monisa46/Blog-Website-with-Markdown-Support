/// ===== DOM Elements =====
const markdownInput = document.getElementById('markdown-input');
const previewPane = document.getElementById('preview');
const savePostBtn = document.getElementById('save-post-btn');
const postTitleInput = document.getElementById('post-title');
const postsList = document.getElementById('posts-list');
const editorSection = document.getElementById('editor-section');
const postsSection = document.getElementById('posts-section');
const newPostBtn = document.getElementById('new-post-btn');
const viewPostsBtn = document.getElementById('view-posts-btn');
const modal = document.getElementById('post-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal');

// ===== Utility Functions =====
function getSavedPosts() {
  return JSON.parse(localStorage.getItem('markdownPosts') || '[]');
}

function savePostsToStorage(posts) {
  localStorage.setItem('markdownPosts', JSON.stringify(posts));
}

function clearEditor() {
  postTitleInput.value = '';
  markdownInput.value = '';
  previewPane.innerHTML = '<p class="text-muted">Live preview will appear here...</p>';
}

// ===== Live Markdown Preview =====
markdownInput.addEventListener('input', () => {
  const content = markdownInput.value;
  if (content.trim()) {
    previewPane.innerHTML = marked.parse(content);
  } else {
    previewPane.innerHTML = '<p class="text-muted">Live preview will appear here...</p>';
  }
});

// ===== Save Blog Post =====
savePostBtn.addEventListener('click', () => {
  const title = postTitleInput.value.trim();
  const content = markdownInput.value.trim();

  if (!title || !content) {
    alert("Both title and content are required.");
    return;
  }

  const newPost = {
    id: Date.now(),
    title,
    content,
    createdAt: new Date().toISOString()
  };

  const posts = getSavedPosts();
  posts.unshift(newPost);
  savePostsToStorage(posts);

  alert("Post saved!");
  clearEditor();
  renderPosts();
  showPostsView();
});

// ===== Render Posts =====
function renderPosts() {
  const posts = getSavedPosts();
  postsList.innerHTML = '';

  if (posts.length === 0) {
    postsList.innerHTML = '<p class="text-muted">No blog posts yet. Create one!</p>';
    return;
  }

  posts.forEach(post => {
    const card = document.createElement('div');
    card.classList.add('post-card');
    card.innerHTML = `
      <h3>${post.title}</h3>
      <p>${new Date(post.createdAt).toLocaleString()}</p>
    `;
    card.addEventListener('click', () => openPostModal(post));
    postsList.appendChild(card);
  });
}

// ===== Modal: View Full Post =====
function openPostModal(post) {
  modalTitle.textContent = post.title;
  modalBody.innerHTML = marked.parse(post.content);
  modal.classList.remove('hidden');
}

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

// ===== Navigation Buttons =====
newPostBtn.addEventListener('click', () => {
  showEditorView();
});

viewPostsBtn.addEventListener('click', () => {
  showPostsView();
});

function showEditorView() {
  editorSection.style.display = 'block';
  postsSection.style.display = 'none';
}

function showPostsView() {
  editorSection.style.display = 'none';
  postsSection.style.display = 'block';
  renderPosts();
}

// ===== On Page Load =====
document.addEventListener('DOMContentLoaded', () => {
  showPostsView();
});

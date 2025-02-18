<template>
    <div class="content">

    <div class="search-add-client">
    <div class="search-bar">
        <input type="text" id="search-input" placeholder="ENTER SEARCH TERMS (EG: ONLINE, 192.168.0.)">
        <button id="search-button"><i class="fas fa-search"></i></button>
    </div>
    <button id="add-client-button" class="add-client-button">
        <i class="fas fa-plus"></i> Add Client
    </button>
</div>


<!-- Add Client Modal -->
<div id="add-client-modal" class="modal">
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3>Add New Client</h3>
        <form id="add-client-form">
            <!-- PPPoE Username -->
            <div class="form-row">
                <div class="form-group">
                    <label for="pppoe-username">PPPoE Username*</label>
                    <input type="text" id="pppoe-username" name="pppoe-username" placeholder="user1234" required>
                </div>
                <div class="form-group">
                    <label for="name">Name*</label>
                    <input type="text" id="name" name="name" placeholder="E.g Ibrahim Swaleh" required>
                </div>
            </div>

            <!-- Email and Phone -->
            <div class="form-row">
                <div class="form-group">
                    <label for="email">Email (Optional)</label>
                    <input type="email" id="email" name="email" placeholder="client@email.com">
                </div>
                <div class="form-group">
                    <label for="phone">Phone*</label>
                    <input type="text" id="phone" name="phone" placeholder="0712345678" required>
                </div>
            </div>

            <!-- Location and Apartment Block -->
            <div class="form-row">
                <div class="form-group">
                    <label for="location">Location (Optional)</label>
                    <input type="text" id="location" name="location" placeholder="Mtwapa Creek">
                </div>
                <div class="form-group">
                    <label for="apartment-block">Apartment Block (Optional)</label>
                    <input type="text" id="apartment-block" name="apartment-block" placeholder="Block C">
                </div>
            </div>

            <!-- Profile/Plan and PPPoE Password -->
            <div class="form-row">
                <div class="form-group">
                    <label for="profile">Select Profile/Plan*</label>
                    <select id="profile" name="profile" required>
                        <option value="10 Mbps">10 Mbps</option>
                        <option value="20 Mbps">20 Mbps</option>
                        <option value="50 Mbps">50 Mbps</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="pppoe-password">PPPoE Password*</label>
                    <input type="password" id="pppoe-password" name="pppoe-password" placeholder="user1234" required>
                </div>
            </div>

            <!-- Coordinates and House -->
            <div class="form-row">
                <div class="form-group">
                    <label for="coordinates">Coordinates (Optional)</label>
                    <input type="text" id="coordinates" name="coordinates" placeholder="-3.5000,35.4000">
                </div>
                <div class="form-group">
                    <label for="house">House (Optional)</label>
                    <input type="text" id="house" name="house" placeholder="C8">
                </div>
            </div>

            <!-- Expiry Date -->
            <div class="form-group">
                <label for="expiry">Select Expiry Date (Recommended)</label>
                <input type="date" id="expiry" name="expiry" required>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="submit-button">Add Client</button>
        </form>
    </div>
</div>
            <!-- Content Area -->
                <div class="tables">
                    <h3>Client List</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Status</th>
                                <th>Expiry</th>
                                <th>Amount</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="ID">1</td>
                                <td data-label="Username">Job</td>
                                <td data-label="Status">Offline</td>
                                <td data-label="Expiry">27-01-2025 08:58</td>
                                <td data-label="Amount">Sh.10</td>
                                <td data-label="Phone">254777493268</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

</template>
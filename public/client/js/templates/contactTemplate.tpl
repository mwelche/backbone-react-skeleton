<!-- Contact Template -->
<div class="subpage-header">
	<h1>Contact Us</h1>
	<p>Your feedback is valuable to us.</p>
</div>
<div class="subpage-content">
	<form class="registration">
		<section>
			<div class="cf">
				<input type="text" id="contact_name" placeholder="Name" <% if (fname && lname) { %>value="<%= fname %> <%= lname %>"<% } %> >
			</div>
			<div class="cf">
				<input type="text" id="contact_email" placeholder="Email Address" <% if (email) { %>value="<%= email %>"<% } %> >
			</div>
			<div class="cf">
				<textarea id="contact_message" placeholder="Questions/Comments"></textarea>
			</div>
			<button type="button" class="submit">Submit</button>
		</section>
	</form>
</div>
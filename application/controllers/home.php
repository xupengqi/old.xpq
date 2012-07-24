<?php 

class Home extends CI_Controller {

	public function index($page = 'home')
	{
		$data_page['title'] = ucfirst($page);
		$data_master['content'] = $this->load->view('home', $data_page, true);

		$this->load->view('templates/master', $data_master);
	}
}
